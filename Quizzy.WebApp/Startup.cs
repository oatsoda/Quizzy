using AutoMapper;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.DomainServices;
using Quizzy.WebApp.Errors;
using Quizzy.WebApp.QuizProcess;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Quizzy.WebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
#if !DEBUG
            services.AddApplicationInsightsTelemetry();
#endif

            services.AddCosmosDb(Configuration);
            services.AddControllers(c => 
                    {
                        c.Filters.Add(new ResourceNotFoundExceptionFilter());
                        c.Filters.Add(new BadRequestExceptionFilter());
                    })
                    .AddFeatureFolders()
                    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<Startup>())
                    .AddJsonOptions(opt => opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));                    

            services.AddMediatR(typeof(Startup));
            
            services.AddAutoMapper(cfg =>
                                   {
                                       cfg.ShouldMapField = _ => false;
                                       //cfg.ShouldMapProperty = pi => pi.SetMethod != null && !pi.SetMethod.IsPrivate;
                                       cfg.DisableConstructorMapping();
                                       cfg.ShouldMapMethod = _ => false;
                                   }, typeof(Startup));
            
            services.AddSignalR();
            
            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c => 
                { 
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Quizzy API - V1", Version = "v1" });
                    c.CustomSchemaIds(x => x.FullName); 
                    c.EnableAnnotations();

                    c.TagActionsBy(api => 
                        { 
                            var a = api.CustomAttributes().OfType<DisplayNameAttribute>().FirstOrDefault();
                            return new [] { a?.DisplayName };
                        });
                    
                    // Set the comments path for the Swagger JSON and UI.
                    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                    c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
                });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSingleton<DataQuery>();
            services.AddSingleton<DataStore>();
            services.AddSingleton<UnfinishedCompetitionChecker>();
            services.AddSingleton<CompetitionCodeGenerator>();
            services.AddSingleton<RandomCodeGenerator>();
            services.AddSingleton<ParticipantNotifier>();
            services.AddSingleton<LiveQuizzes>();
            services.AddTransient<LiveQuiz>();
            services.AddSingleton<Func<LiveQuiz>>(sp => () => sp.GetService<LiveQuiz>());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.ConfigureCosmosDbDevelopmentEnvironment();
            }
            else
            {
                //app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1 Quizzy API");
            });

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<HubMessages>("/signalr");
            });

            app.MapWhen(
                        context => !context.Request.Path.StartsWithSegments("/api") &&
                                   !context.Request.Path.StartsWithSegments("/signalr") &&
                                   !context.Request.Path.StartsWithSegments("/swagger"),
                        app2 => app2.UseSpa(spa =>
                                           {
                                               spa.Options.SourcePath = "ClientApp";

                                               if (env.IsDevelopment())
                                                   spa.UseReactDevelopmentServer(npmScript: "start");
                                           })
                       );
        }
    }
}
