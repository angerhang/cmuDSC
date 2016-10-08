myData <- read.csv('../data/rawData.csv')

## normalizae day 
myData$DAY <- myData$DAY - min(myData$DAY)

## remove quantity with value 0
myData <- myData[myData$QUANTITY != 0 ,]

## Add price per product 
myData$PRICE_PER_PRODUCT = myData$BASE_SPEND_AMT / myData$QUANTITY

## Household demographics data 
householdData <- myData[! duplicated(myData$household_key) ,]
                          
## ToDo(Phill) time series for household shopping                          
                        
write.csv(myData, '../data/cleanData.csv')
