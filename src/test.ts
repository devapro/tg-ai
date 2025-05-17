import { checkContent } from "./gemeni";

const text = `
 **Релиз Jetpack Navigation 2.9.0**

🛠 Значительные переработки под капотом для улучшения поддержки KMP
👉 Добавлена поддержка обработки deep link из Kotlin Common кода
👉 Улучшения API

#jetpack #jetpackupdate #navigation #compose #kmp
`

const result = await checkContent(text);
        if (result.summary != undefined && result.summary.length > 0) {
                console.log(result);
                
            }