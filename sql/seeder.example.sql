-- Sample query to match against all the table

/*
select * from "Monitors" 
LEFT JOIN "DiscordWebhooks" 
on "Monitors"."discordWebhookId" = "DiscordWebhooks"."id" 
LEFT JOIN "Differences"
on "Monitors"."differencesId" = "Differences"."id"
LEFT JOIN "NestedSelectors"
on "Monitors"."nestedSelectorsId" = "NestedSelectors"."id"
*/


-- Why are we using this. It's because its easier to write and port without writing the actual code
INSERT INTO 

INSERT INTO "Monitors" () values ()