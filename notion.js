import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_KEY
})

export async function getDatabase(databaseId){
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 20,
    sorts: [
      {
        timestamp: 'last_edited_time',
        direction: 'descending'
      }
    ]
  })
  return response.results
}