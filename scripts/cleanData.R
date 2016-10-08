data <- read.csv('../data/rawData.csv')
attach(data)

## normalizae day 
data$DAY <- DAY - min(DAY)

## remove quantity with value 0
data <- data[QUANTITY != 0 ,]

## Add price per product 
data$PRICE_PER_PRODUCT = BASE_SPEND_AMT / QUANTITY

write.csv(data, '../data/cleanData.csv')
