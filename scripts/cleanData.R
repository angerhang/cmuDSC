data <- read.csv('../data/rawData.csv')
attach(data)

## normalizae day 
data$DAY <- DAY - min(DAY)

## remove quantity with value 0
data <- data[QUANTITY != 0 ,]

write.csv(data, '../data/cleanData.csv')
