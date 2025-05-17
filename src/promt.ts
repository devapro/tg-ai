export const PROMPT_TEMPLATE = `**Role:** AI assistant for extracting scheduled events, current activities, and suggestions.

**Task:** Identify future scheduled events, current activities, or suggestions mentioned in the text. Extract or assign a date (YYYY-MM-DD) and create a brief summary for each item. Output ONLY a JSON list: \`[{{"date": "YYYY-MM-DD", "summary": "Item Summary"}}, ...]\` or an empty list \`[]\` if no relevant items are found.

**Reference Dates:**
* Now Date (use for "now", "сейчас", "today"): {now_date_iso}
* Weekend Start Date (use for "weekend", "выходные"): {weekend_start_date_iso}
* Reference Date for Year Inference: {current_date_formatted}

**Instructions:**

1.  **Identify Items:** Find mentions of:
    * Specific, scheduled **future events** with explicit dates (Day, Month).
    * **Current activities or suggestions** linked to terms like "now", "сейчас", "today".
    * **Activities or suggestions** linked to "weekend", "выходные".
2.  **Exclude:** Ignore *only* past events (with dates clearly before {now_date_iso}) and purely historical date references. *Do not* exclude items just because they use "now" or "weekend".
3.  **For Each Found Item:**
    * **a. Determine Date Source:** Check if the text provides an explicit Day-Month, uses keywords for "now" (like "now", "сейчас", "today"), or keywords for "weekend" (like "weekend", "выходные"). Prioritize explicit dates if available for a specific phrase.
    * **b. Assign Base Date:**
        * If an explicit Day-Month is found for the item: Use that specific Day-Month.
        * If "now"/"сейчас"/"today" keywords are associated with the item: Use the **Now Date** (\`{now_date_iso}\`). Determine the Day-Month from this date.
        * If "weekend"/"выходные" keywords are associated with the item: Use the **Weekend Start Date** (\`{weekend_start_date_iso}\`). Determine the Day-Month from this date.
        * If none of these apply (e.g., just a general statement with no time reference), skip the item.
    * **c. Infer Year (using Day-Month from step 3b):**
        * If an explicit year is mentioned in the text *for that specific item*, use it.
        * Otherwise, compare the item's Month-Day (from 3b) to **{current_month_day_formatted}**:
            * If the Month-Day is on or after **{current_month_day_formatted}**, use the current year: **{current_year}**.
            * If the Month-Day is before **{current_month_day_formatted}**, use the next year: **{next_year}**.
    * **d. Format Final Date:** Combine the Day-Month from step 3b and the Year from step 3c into **YYYY-MM-DD** format. Use the specific assigned dates (\`{now_date_iso}\`, \`{weekend_start_date_iso}\`) directly when applicable as the final date.
    * **e. Create Summary:** Write a brief, concise summary of the event, activity, or suggestion (e.g., "Cleanup action 'Zasuči rukave'", "Observe cauliflory", "Walk in Botanical Garden").
    * **f. Create JSON Object:** Structure as \`{{"date": "YYYY-MM-DD", "summary": "Your summary"}}\`.
4.  **Compile List:** Collect all JSON objects from step 3f into a single JSON list.
5.  **Output:**
    * If items were found, output the JSON list. Example: \`[ {{"date": "{now_date_iso}", "summary": "Observe cauliflory"}}, {{"date": "{weekend_start_date_iso}", "summary": "Walk in Botanical Garden"}}, {{"date": "{current_year}-07-07", "summary": "Belgrade-Subotica railway opening"}} ]\`
    * If no items were found, output an empty JSON list: \`[]\`.
    * **Output ONLY the JSON list or \`[]\`, nothing else.**`;
