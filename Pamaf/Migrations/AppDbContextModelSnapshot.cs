﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Pamaf.Context;

namespace Pamaf.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.1-rtm-30846")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Pamaf.Entities.GameLevel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("GameSessionId");

                    b.Property<int>("LevelNumber");

                    b.HasKey("Id");

                    b.HasIndex("GameSessionId");

                    b.ToTable("GameLevels");
                });

            modelBuilder.Entity("Pamaf.Entities.GameSession", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<bool>("Finished");

                    b.Property<int>("Hearts");

                    b.Property<int>("Score");

                    b.Property<Guid?>("UserId");

                    b.Property<int>("Year");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("GameSessions");
                });

            modelBuilder.Entity("Pamaf.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("FacebookId");

                    b.Property<string>("FacebookName");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Pamaf.Entities.GameLevel", b =>
                {
                    b.HasOne("Pamaf.Entities.GameSession", "GameSession")
                        .WithMany("Levels")
                        .HasForeignKey("GameSessionId");
                });

            modelBuilder.Entity("Pamaf.Entities.GameSession", b =>
                {
                    b.HasOne("Pamaf.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });
#pragma warning restore 612, 618
        }
    }
}
