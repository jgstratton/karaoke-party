﻿// <auto-generated />
using System;
using KaraokeParty.DataStore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KaraokeParty.Migrations
{
    [DbContext(typeof(KPContext))]
    [Migration("20230222032301_RenameSingerTable")]
    partial class RenameSingerTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Proxies:ChangeTracking", false)
                .HasAnnotation("Proxies:CheckEquality", false)
                .HasAnnotation("Proxies:LazyLoading", true)
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("KaraokeParty.DataStore.Party", b =>
                {
                    b.Property<int>("PartyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("party_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PartyId"));

                    b.Property<DateTime>("DateTimeCreated")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("date_time_created");

                    b.Property<bool>("IsExpired")
                        .HasColumnType("boolean")
                        .HasColumnName("is_expired");

                    b.Property<bool>("MarqueeEnabled")
                        .HasColumnType("boolean")
                        .HasColumnName("marquee_enabled");

                    b.Property<int>("MarqueeSize")
                        .HasColumnType("integer")
                        .HasColumnName("marquee_size");

                    b.Property<int>("MarqueeSpeed")
                        .HasColumnType("integer")
                        .HasColumnName("marquee_speed");

                    b.Property<string>("MarqueeText")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("marquee_text");

                    b.Property<string>("PartyKey")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)")
                        .HasColumnName("party_key");

                    b.Property<int>("PlayerState")
                        .HasColumnType("integer")
                        .HasColumnName("player_state");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)")
                        .HasColumnName("title");

                    b.Property<int>("VideoLength")
                        .HasColumnType("integer")
                        .HasColumnName("video_length");

                    b.Property<decimal>("VideoPosition")
                        .HasColumnType("numeric")
                        .HasColumnName("video_position");

                    b.HasKey("PartyId")
                        .HasName("pk_parties");

                    b.ToTable("parties", (string)null);
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Performance", b =>
                {
                    b.Property<int>("PerformanceID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("performance_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PerformanceID"));

                    b.Property<int?>("PartyId")
                        .HasColumnType("integer")
                        .HasColumnName("party_id");

                    b.Property<string>("SingerName")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("singer_name");

                    b.Property<string>("SongFileName")
                        .HasColumnType("text")
                        .HasColumnName("song_file_name");

                    b.Property<int?>("Sort_Order")
                        .HasColumnType("integer")
                        .HasColumnName("sort_order");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("status");

                    b.Property<int?>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("PerformanceID")
                        .HasName("pk_performances");

                    b.HasIndex("PartyId")
                        .HasDatabaseName("ix_performances_party_id");

                    b.HasIndex("SongFileName")
                        .HasDatabaseName("ix_performances_song_file_name");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_performances_user_id");

                    b.ToTable("performances", (string)null);
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Song", b =>
                {
                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("title");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("url");

                    b.HasKey("FileName")
                        .HasName("pk_songs");

                    b.ToTable("songs", (string)null);
                });

            modelBuilder.Entity("KaraokeParty.DataStore.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserId"));

                    b.Property<bool>("IsDj")
                        .HasColumnType("boolean")
                        .HasColumnName("is_dj");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)")
                        .HasColumnName("name");

                    b.Property<int?>("PartyId")
                        .HasColumnType("integer")
                        .HasColumnName("party_id");

                    b.HasKey("UserId")
                        .HasName("pk_users");

                    b.HasIndex("PartyId")
                        .HasDatabaseName("ix_users_party_id");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Performance", b =>
                {
                    b.HasOne("KaraokeParty.DataStore.Party", "Party")
                        .WithMany("Queue")
                        .HasForeignKey("PartyId")
                        .HasConstraintName("fk_performances_parties_party_id");

                    b.HasOne("KaraokeParty.DataStore.Song", "Song")
                        .WithMany()
                        .HasForeignKey("SongFileName")
                        .HasConstraintName("fk_performances_songs_song_temp_id");

                    b.HasOne("KaraokeParty.DataStore.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("fk_performances_users_user_id");

                    b.Navigation("Party");

                    b.Navigation("Song");

                    b.Navigation("User");
                });

            modelBuilder.Entity("KaraokeParty.DataStore.User", b =>
                {
                    b.HasOne("KaraokeParty.DataStore.Party", null)
                        .WithMany("Singers")
                        .HasForeignKey("PartyId")
                        .HasConstraintName("fk_users_parties_party_id");
                });

            modelBuilder.Entity("KaraokeParty.DataStore.Party", b =>
                {
                    b.Navigation("Queue");

                    b.Navigation("Singers");
                });
#pragma warning restore 612, 618
        }
    }
}
