import * as elasticsearch from "elasticsearch";
import * as tfhub from "@tensorflow-models/universal-sentence-encoder";

const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"],
  ssl: { rejectUnauthorized: false },
});

const INDEX_NAME = "posts";
const SEARCH_SIZE = 5;

export async function embedText(text: string | string[]) {
  const model = await tfhub.load();
  const vectors = await model.embed(text);
  return vectors.arraySync();
}

export async function handleQuery(queryString: string) {
  const embeddingStart = Date.now();
  const queryVector = await embedText(queryString);
  const embeddingTime = Date.now() - embeddingStart;

  const scriptQuery = {
    script_score: {
      query: { match_all: {} },
      script: {
        source:
          "cosineSimilarity(params.query_vector, doc['title_vector']) + 1.0",
        params: { query_vector: queryVector },
      },
    },
  };

  const searchStart = Date.now();
  const response = await client.search({
    index: INDEX_NAME,
    body: {
      size: SEARCH_SIZE,
      query: scriptQuery,
      _source: { includes: ["title", "body"] },
    },
  });
  const searchTime = Date.now() - searchStart;

  console.log();
  console.log(`${response.hits.total} total hits.`);
  console.log(`embedding time: ${embeddingTime} ms`);
  console.log(`search time: ${searchTime} ms`);
  response.hits.hits.forEach((hit) => {
    console.log(`id: ${hit._id}, score: ${hit._score}`);
    console.log(hit._source);
    console.log();
  });
}
