import { getArticleData } from '../../../lib/articles';

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const articleData = await getArticleData(params.slug);

  console.log(articleData, 'asdfasdf');
  return (
    <>
      <h1>{articleData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: articleData.contentHtml }} />
    </>
  );
}
