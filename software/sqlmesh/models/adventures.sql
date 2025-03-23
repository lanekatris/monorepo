MODEL (
      name models.adventures
);




-- select * from public.markdown_file_models where file_path like '/Adventures/%'



SELECT regexp_replace(
               regexp_replace(file_path, '^.*/\d{4}-\d{2}-\d{2} ', '', 'g'),
               '\.md$', '', 'g'
       ) adventure_type, * from public.markdown_file_models where file_path like '/Adventures/%'