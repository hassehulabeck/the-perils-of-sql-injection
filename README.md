# Exempel på hur SQL injection fungerar
## Iordningställ databasen
1. Skapa en databas som heter **injection**
2. Importera filen ```injection.sql```
3. Skapa användaren ```injectionManager``` med lösenordet ```br0mmabl0cks```
4. Du ska nu ha två tabeller (users och members). De innehåller exakt samma information.

## Installera applikationen
1. Ladda ner/klona och kör ```npm install```
2. Kör ```node index.js```

## Testkör
1. Skriv in adressen ```http://localhost:8080/users/1```
2. All info om användare 1 i user-tabellen ska visas. Det finns användare 1-4 i databasen.
3. Skriv in adressen ```http://localhost:8080/members/1```
4. All info om användare 1 i members-tabellen ska visas. Det finns användare 1-4 i databasen.

## Testkör en SQL injection
Members-routen är skyddad mot injection, men det är inte users.
Prova att skriv in adressen ```http://localhost:8080/users/1'%20OR%20'1=1``` och se vad du får fram.

### 1=1 är alltid sant
Den del av URLen som följer på /users/1 är "tillägget" **OR 1=1**
När den koden plockas in i queryn så betyder det "visa användare med id=1 eller alla användare"
```javascript
    let query = `SELECT * FROM users WHERE users.id = '${req.params.id}'`
```
I koden här lägger vi in en parameter från URLen direkt i queryn, utan att göra någon som helst tvätt, kontroll eller liknande. Det innebär att vårt injection-försök ovan kommer att producera en query som ser ut så här:
```mysql
SELECT * FROM users WHERE users.id = '1' OR '1=1'
```
Det innebär att vi som svar kommer att få alla användare i users-tabellen, och det kan ju vara lite dumt ur säkerhetssynpunkt.

### Escape är ett lätt sätt att tvätta
Bättre är att göra som det andra avsnittet i koden:
```javascript
    let query = "SELECT * FROM members WHERE id = " + connection.escape(req.params.id)
```
Här använder vi en s k escape-funktion som tvättar bort eventuell skadlig kod.
Så om du skriver in URLen ```http://localhost:8080/members/3'%20OR%20'1=1``` så får queryn följande utseende:
```mysql
SELECT * FROM members WHERE id = '1\' OR \'1=1'
```
vilket enbart ger oss användare 1 och inget annat.

## Betrakta alltid input (formulär, URL etc) som skadlig kod
Tvätta den. Alla databasspråk har inbyggda funktioner för detta, antingen direkt i språket eller i applikationskod/-tillägg.