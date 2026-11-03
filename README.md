# u02---Individuell-uppgift-Portfolio-med-JavaScript-

Datans Väg: Allt börjar i loadProjects() i project.js. Först anropar jag showLoading(status), så att besökaren ser en snurra. Sedan skickar fetchRepos() en GET-förfrågan till https://api.github.com/users/gabbe03/repos?sort=updated&per_page=30. Parametrarna ber GitHub sortera på senast uppdaterad och begränsa listan till 30 repon. Webbläsaren skickar förfrågan och GitHub svarar med en statuskod och en JSON-lista där varje repo är ett objekt med fält som name, description, html_url, language, homepage och fork.

Innan något visas gör koden fyra saker. Först kontrollerar den statuskoden, eftersom fetch inte kastar fel för 404 eller 403. Jag måste själv titta på response.status och response.ok och kasta ett eget fel. Sedan gör response.json() om texten till ett JavaScript-objekt. Därefter filtrerar .filter(repo => !repo.fork) bort kopior av andras projekt, så att bara mina egna visas. Till sist slår jag ihop varje repo med mina egna uppgifter och bygger HTML med .map(createCardHTML).join(""). Resultatet sätts in med innerHTML och snurran tas bort.

Två datakällor: about.json har jag själv skrivit så jag kan ändra direkt vad som ska visas och den ligger på samma server som sidan så den har ingen begräns för antal anrop.

GitHubs API kan jag inte ändra lika lätt och jag har ingen kontroll om API ligger nere eller hur många anrop jag kan göra. Det är varför jag har fallback kod som (const image = extra.image || DEFAULT_IMAGE;), (const description = repo.description || "No description yet.";) och (const stack = repo.language || "Not specified";).

DOM och händelser: Jag bygger om sidan genom att bygga HTML som text med template strings och sätta in den i de tomma behållarna #work-list, #education-list och #project-status, #project-grid. Det är enkelt och läsbart men innerHTML byter ut hela innehållet på en gång.

Jag lag till en knapp som syns när projekten inte laddas från API:et som laddar om de, antingen för att ditt internet eller API:et inte fungerar. Jag testade knappen i dev tools genom att blocka API:et och ladda om sidan sedan av blocka API:et och trycka på knappen.

Markup du inte skrivit för hand: Jag använde createCardHTML och createJobHTML för att ha samma struktur som jag hade i u01. Jag kunde nu lätt ha alt-texter till bilderna med (Preview of ${repo.name}) tack vare API:et och länkar som öppnas i ny flik har rel="noopener".

Statusfältet har aria-live="polite", så att skärmläsare får veta när innehållet ändras. Felmeddelandet har role="alert" och snurran har aria-hidden="true", eftersom den bara är dekoration och texten “Loading projects…” bär informationen.

Temaväxlingen: Alla färger ligger i variables.css och för mörkt läge ligger de i dark.css som länkas till alla html sidor. dark.css har en media query som anropas om användaren har satt deras prefererat läge till darkmode på deras webbläsare. Jag behövde ändra vissa ikoner i darkmode också med filter: invert() eller brightness();.

Hade jag satt färgerna i JavaScript hade jag behövt lyssna på matchMedia("(prefers-color-scheme: dark)"), sätta inline-stilar på varje genererat element och göra om det när användaren byter läge. Dessutom hade färgerna varit utspridda över två språk så att en ändring krävt att jag letade i flera filer.

När det inte går som tänkt: Om API:n är långsam med att ladda vissas en loading spinner med texten "Loading projects…" under spinnern. Jag testade det med slow 3g i Chrome dev tools.

fetchRepos() kastar olika fel för 403/429 (för många anrop), 404 (användaren finns inte) och övriga felkoder. showError() visar meddelandet på sidan. Om internet är nere kastar fetch ett TypeError med ett kryptiskt meddelande så då visar jag ett eget: "Could not reach GitHub. Check your internet connection and try again.". Om API:et tar för lång tid att hämta projekten så står det "GitHub took too long to answer. Please try again." med en knapp för att testa om.

Styrkor och brister: Det som blev bra är att datahämtning, felhantering och HTML-byggande ligger i separata funktioner så att jag kan hitta och ändra varje del. Sidan fungerar även när min egen JSON saknas och felen syns för besökaren.

Med mer tid skulle jag göra en script fil för headern och footern till alla HTML dokument så att jag inte behöver kopiera samma HTML kod i alla pages och om jag behöver ändra något blir det så mycket lättare.

AI-verktyg: Jag använde Claude för att fråga om det är något jag kan göra lättare eller bättre än hur jag skrev det, felsöka kod när något gick fel och kopiera min data från about sidan till en json fil. Jag frågade också vad jag skulle kunna lägga till för extra interaktiv funktion samt hur jag skulle testa ut alla funktioner i dev tools.

Webbsidan: https://gabbe03.github.io/u02---Individuell-uppgift-Portfolio-med-JavaScript-Gabriel.github.io/
