#
# V2

library(shiny)
library(RCurl)
library(digest)
library(jsonlite)
library(httr)

# Define server logic
shinyServer(function(input, output, session) {
        
        # keys.txt is not on Github obviously! 
        # The file has to be placed in the same folder as server.R
        keys <- readLines('keys.txt')
        api_key <- keys[1]
        secret_key <- keys[2]

        base <- 'https://api.edinburghfestivalcity.com/events'


        events <- eventReactive({input$date_from
                                input$date_to
                                input$title
                                input$artist
                                input$venue}, {
                                        
                # for testing
                #date_from <- "&date_from=2018-08-01+00:00:00"
                #date_to <- "&date_to=2018-08-31+23:59:59"
                                        
                date_from <- paste0('&date_from=', curlEscape(paste(input$date_from, '00:00:00')))
                date_to <- paste0('&date_to=', curlEscape(paste(input$date_to, '23:59:59')))
                artist <- ifelse(input$artist=='', '', 
                                    paste0('&artist=', curlEscape(input$artist)))
                venue <- ifelse(input$venue=='', '', 
                                    paste0('&venue=', curlEscape(input$venue)))
                title <- ifelse(input$title=='', '', 
                                    paste0('&title=', curlEscape(input$title)))

                query <- paste0('/events?year=2018',
                                date_from, date_to, 
                                artist, venue, title,
                                '&key=', api_key)
                sig <- hmac(secret_key, query, algo='sha1', serialize = F)
                myurl <- paste0('https://api.edinburghfestivalcity.com', query, '&signature=', sig)
                mydata <- content(GET(myurl), as="text")
                mydata
        })
        
        observe({
                # Send the data to the browser
                eventsnow <- events()
                session$sendCustomMessage("eventdata", eventsnow)
        })
})
