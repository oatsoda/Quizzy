using AutoMapper;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quizzy.WebApp.Data.Startup;

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
            services.AddCosmosDb(Configuration);
            services.AddControllers()
                    .AddFeatureFolders()
                    .AddFluentValidation(c => c.RegisterValidatorsFromAssemblyContaining<Startup>());

            services.AddMediatR(typeof(Startup));
            
            services.AddAutoMapper(cfg =>
                                   {
                                       cfg.ShouldMapField = _ => false;
                                       //cfg.ShouldMapProperty = pi => pi.SetMethod != null && !pi.SetMethod.IsPrivate;
                                       cfg.DisableConstructorMapping();
                                       cfg.ShouldMapMethod = _ => false;
                                   }, typeof(Startup));
            
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
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

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.MapWhen(
                        context => !context.Request.Path.StartsWithSegments("/api"),
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
