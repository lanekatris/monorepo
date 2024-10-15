import {
  getRaindrops,
  RAINDROP_COLLECTION_RECIPES
} from '../../../feed/get-feed';
import { RaindropFeedItem } from '../feed/page';

export default async function FoodPage() {
  const raindrops = await getRaindrops();
  const recipes = raindrops.filter(
    (x) => x.data.raindrop?.collectionId === RAINDROP_COLLECTION_RECIPES
  );

  return (
    <main>
      <h1>Food Bookmarks ({recipes.length})</h1>
      {recipes.map((recipe) => (
        <RaindropFeedItem key={recipe.id} input={recipe} />
      ))}
    </main>
  );
}
