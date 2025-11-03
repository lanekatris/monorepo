MODEL (
    name models.obsidian_tags_summary
      );
select tag,count(*) count,min(file_date) min_date, max(file_date) max_date from models.obsidian_tags group by tag
