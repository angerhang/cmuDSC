myData <- read.csv('../data/rawData.csv')

myData$X <- NULL
## normalizae day 
myData$DAY <- myData$DAY - min(myData$DAY)

## remove quantity with value 0
myData <- myData[myData$QUANTITY != 0 ,] 

## Add price per product 
myData$PRICE_PER_PRODUCT = myData$BASE_SPEND_AMT / myData$QUANTITY

## Add egg variable 
myData$GET_EGGS = as.integer(myData$COMMODITY_DESC == 'EGGS')

## Household demographics data 
householdData <- myData[! duplicated(myData$household_key) ,]
                          
## Encode categorical data 

write.csv(myData, '../data/cleanData.csv')
write.csv(householdData, '../data/householdData.csv')
   