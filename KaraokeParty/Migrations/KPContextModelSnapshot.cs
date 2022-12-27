﻿// <auto-generated />
using System;
using KaraokeParty.DataStore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeParty.Migrations
{
    [DbContext(typeof(KPContext))]
    partial class KPContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("KaraokeParty.DataStore.Party", b =>
                {
                    b.Property<int>("PartyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PartyId"));

                    b.Property<DateTime>("DateTimeCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsExpired")
                        .HasColumnType("boolean");

                    b.Property<string>("PartyKey")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.HasKey("PartyId");

                    b.ToTable("Parties");
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Singer", b =>
                {
                    b.Property<int>("SingerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SingerId"));

                    b.Property<bool>("IsDj")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<int?>("PartyId")
                        .HasColumnType("integer");

                    b.HasKey("SingerId");

                    b.HasIndex("PartyId");

                    b.ToTable("Singers");
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Singer", b =>
                {
                    b.HasOne("KaraokeParty.DataStore.Party", "Party")
                        .WithMany("Singers")
                        .HasForeignKey("PartyId");

                    b.Navigation("Party");
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Party", b =>
                {
                    b.Navigation("Singers");
                });
#pragma warning restore 612, 618
        }
    }
}
