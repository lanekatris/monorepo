MODEL (
    name models.obsidian_file
      );

with x as (
    select length(file_path) - length(replace(file_path, '/', '')) folder_depth,* from markdown_file_models
),
     y as (
         select folder_depth = 1 in_root, * from x
     )
select * from y