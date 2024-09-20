import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_KEY
})

export async function getDatabase(databaseId){
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 13
  })
  return response.results
}