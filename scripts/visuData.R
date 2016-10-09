myData <- read.csv('../data/cleanData.csv')

# day
hist(myData$DAY, breaks = "Sturges")


# 
hist(myData$HOMEOWNER_DESC)

# Homeowner
table(myData$HOMEOWNER_DESC)