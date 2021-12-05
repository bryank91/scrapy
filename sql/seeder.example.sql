-- Sample query to match against all the table

/*
select * from "Monitor" 
LEFT JOIN "DiscordWebhook" 
on "Monitor"."discordWebhookId" = "DiscordWebhook"."id" 
LEFT JOIN "Difference"
on "Monitor"."differenceId" = "Difference"."id"
LEFT JOIN "NestedSelector"
on "Monitor"."nestedSelectorId" = "NestedSelector"."id"
*/


-- Why are we using this. It's because its easier to write and port without writing the actual code
INSERT INTO 

INSERT INTO "Monitor" () values ()