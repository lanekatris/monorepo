using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Web.Db
{
    public partial class LkatContext : DbContext
    {
        public LkatContext(DbContextOptions<LkatContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Adventure> Adventures { get; set; } = null!;
        public virtual DbSet<AdventurePlace> AdventurePlaces { get; set; } = null!;
        public virtual DbSet<AttributedPlace> AttributedPlaces { get; set; } = null!;
        public virtual DbSet<Bookmark> Bookmarks { get; set; } = null!;
        public virtual DbSet<Disc> Discs { get; set; } = null!;
        public virtual DbSet<Feed> Feeds { get; set; } = null!;
        public virtual DbSet<Maintenance> Maintenances { get; set; } = null!;
        public virtual DbSet<Place> Places { get; set; } = null!;
        public virtual DbSet<Trip> Trips { get; set; } = null!;
        public virtual DbSet<TripPlace> TripPlaces { get; set; } = null!;

        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Adventure>(entity =>
            {
                entity.ToTable("adventure");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Activities)
                    .HasColumnType("json")
                    .HasColumnName("activities");

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasColumnName("created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .HasColumnName("name")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");

                entity.Property(e => e.Notes)
                    .HasMaxLength(1000)
                    .HasColumnName("notes")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");
            });

            modelBuilder.Entity<AdventurePlace>(entity =>
            {
                entity.ToTable("adventure_place");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AdventureId).HasColumnName("adventureId");

                entity.Property(e => e.PlaceId).HasColumnName("placeId");
            });

            modelBuilder.Entity<AttributedPlace>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("attributed_place");

                entity.Property(e => e.City)
                    .HasColumnType("text")
                    .HasColumnName("city");

                entity.Property(e => e.Elevation).HasColumnName("elevation");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.IsStatePark).HasColumnName("isStatePark");

                entity.Property(e => e.Name)
                    .HasColumnType("text")
                    .HasColumnName("name");

                entity.Property(e => e.Notes)
                    .HasColumnType("text")
                    .HasColumnName("notes");

                entity.Property(e => e.State)
                    .HasColumnType("text")
                    .HasColumnName("state");

                entity.Property(e => e.Tags)
                    .HasColumnType("json")
                    .HasColumnName("tags");

                entity.Property(e => e.Visited).HasColumnName("visited");

                entity.Property(e => e.Zip)
                    .HasColumnType("text")
                    .HasColumnName("zip");
            });

            modelBuilder.Entity<Bookmark>(entity =>
            {
                entity.ToTable("bookmark");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasColumnName("created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.ImageUrl)
                    .HasMaxLength(1000)
                    .HasColumnName("imageUrl")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");

                entity.Property(e => e.Meta)
                    .HasColumnType("json")
                    .HasColumnName("meta");

                entity.Property(e => e.Name)
                    .HasMaxLength(1000)
                    .HasColumnName("name")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");

                entity.Property(e => e.Status)
                    .HasMaxLength(10)
                    .HasColumnName("status");

                entity.Property(e => e.Tags)
                    .HasColumnType("json")
                    .HasColumnName("tags");

                entity.Property(e => e.Url)
                    .HasMaxLength(1000)
                    .HasColumnName("url")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");
            });

            modelBuilder.Entity<Disc>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("disc");

                entity.HasIndex(e => e.Id, "disc_pk")
                    .IsUnique();

                entity.Property(e => e.Brand)
                    .HasMaxLength(100)
                    .HasColumnName("brand");

                entity.Property(e => e.Color)
                    .HasMaxLength(25)
                    .HasColumnName("color");

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasColumnName("created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");

                entity.Property(e => e.Model)
                    .HasMaxLength(100)
                    .HasColumnName("model");

                entity.Property(e => e.Number).HasColumnName("number");

                entity.Property(e => e.Price)
                    .HasPrecision(4, 2)
                    .HasColumnName("price");

                entity.Property(e => e.RealCreatedDate).HasColumnName("real_created_date");

                entity.Property(e => e.Status)
                    .HasMaxLength(25)
                    .HasColumnName("status");

                entity.Property(e => e.Tags)
                    .HasColumnType("json")
                    .HasColumnName("tags")
                    .HasDefaultValueSql("_utf8mb4\\'[]\\'");

                entity.Property(e => e.Type)
                    .HasMaxLength(5)
                    .HasColumnName("type")
                    .HasDefaultValueSql("'disc'");

                entity.Property(e => e.Weight).HasColumnName("weight");
            });

            modelBuilder.Entity<Feed>(entity =>
            {
                entity.ToTable("feed");

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasColumnName("created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Data)
                    .HasColumnType("json")
                    .HasColumnName("data");

                entity.Property(e => e.Message)
                    .HasMaxLength(1000)
                    .HasColumnName("message");

                entity.Property(e => e.Tags)
                    .HasColumnType("json")
                    .HasColumnName("tags")
                    .HasDefaultValueSql("_utf8mb4\\'[]\\'");

                entity.Property(e => e.Type)
                    .HasMaxLength(100)
                    .HasColumnName("type");
            });

            modelBuilder.Entity<Maintenance>(entity =>
            {
                entity.ToTable("maintenance");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasColumnName("created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Name)
                    .HasMaxLength(500)
                    .HasColumnName("name")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.Property)
                    .HasMaxLength(150)
                    .HasColumnName("property")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");
            });

            modelBuilder.Entity<Place>(entity =>
            {
                entity.ToTable("place");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.City)
                    .HasColumnType("text")
                    .HasColumnName("city");

                entity.Property(e => e.Elevation).HasColumnName("elevation");

                entity.Property(e => e.Name)
                    .HasColumnType("text")
                    .HasColumnName("name");

                entity.Property(e => e.Notes)
                    .HasColumnType("text")
                    .HasColumnName("notes");

                entity.Property(e => e.State)
                    .HasColumnType("text")
                    .HasColumnName("state");

                entity.Property(e => e.Tags)
                    .HasColumnType("json")
                    .HasColumnName("tags");

                entity.Property(e => e.TimeFromHomeHours)
                    .HasPrecision(4, 2)
                    .HasColumnName("timeFromHomeHours");

                entity.Property(e => e.Visited).HasColumnName("visited");

                entity.Property(e => e.Zip)
                    .HasColumnType("text")
                    .HasColumnName("zip");
            });

            modelBuilder.Entity<Trip>(entity =>
            {
                entity.ToTable("trip");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasColumnName("created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Name)
                    .HasMaxLength(500)
                    .HasColumnName("name")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");

                entity.Property(e => e.Tags)
                    .HasColumnType("json")
                    .HasColumnName("tags");

                entity.Property(e => e.Url)
                    .HasMaxLength(1000)
                    .HasColumnName("url")
                    .UseCollation("utf8_general_ci")
                    .HasCharSet("utf8");
            });

            modelBuilder.Entity<TripPlace>(entity =>
            {
                entity.ToTable("trip_place");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.PlaceId).HasColumnName("placeId");

                entity.Property(e => e.TripId).HasColumnName("tripId");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
