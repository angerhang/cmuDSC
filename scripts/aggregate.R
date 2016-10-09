myData <- read.csv("../data/cleanData.csv")
houseData <- read.csv("../data/householdData.csv")

# zeros columns that are going to be aggregated
houseData$QUANTITY <- NULL
houseData$BASE_SPEND_AMT <- NULL
houseData$NET_SPEND_AMT <- NULL
houseData$LOY_CARD_DISC <- NULL
houseData$COUPON_DISC <- NULL
houseData$GET_EGGS <- NULL
houseData$PRICE_PER_PRODUCT <- NULL
houseData$DAY <- NULL

# unique house
houseId <- unique(myData$household_key)

# aggregate at day level
dayData <- aggregate(cbind(QUANTITY, BASE_SPEND_AMT, NET_SPEND_AMT, LOY_CARD_DISC, COUPON_DISC, GET_EGGS)
                     ~ household_key+ DAY, data=myData, sum, na.rm= TRUE) 
dayData$WEEK = 0
weekData <- dayData[0, ]
weekData$DAY <- NULL
weekData$PRICE_PER_PRODUCT <- NULL

# dummyRow to create empty entry at weekly level
dummyRow <- dayData[1,]
dummyRow$QUANTITY <- 0
dummyRow$BASE_SPEND_AMT <- 0
dummyRow$NET_SPEND_AMT <- 0
dummyRow$LOY_CARD_DISC <- 0
dummyRow$COUPON_DISC <- 0
dummyRow$GET_EGGS <- 0
dummyRow$PRICE_PER_PRODUCT <- NULL
dummyRow$DAY <- NULL
dummyRow$NEXT_EGGS <- 0
 
# add the meta data such as kids_number and income_category
dayData <- merge(x = dayData, y = houseData, by = 'household_key', all = FALSE)
dayData$X <- NULL
write.csv(dayData, '../data/dayData.csv')

# aggregate at week level
# for each house we fill in the weekly data
# one house will have 29 weekly data
weekStart <- seq(from = 204, to = 0, by = -7)
for (house in houseId){
  weekN <- 28
  lastWeekEgg = 0
  weekHouseData <- dayData[dayData$household_key == house ,]
  for (i in weekStart) {
    firstDay = i
    lastDay = firstDay - 6
    nextFirst = i - 7
    nextLastDay = nextFirst - 6
    thisWeek <- weekHouseData[(weekHouseData$DAY <= firstDay) & (weekHouseData$DAY >= lastDay), ]
    nextWeek <- weekHouseData[(weekHouseData$DAY <= nextFirst) & (weekHouseData$DAY >= nextLastDay), ]
    
    # if no entry is found then we put all the numerical value as 0
    if (nrow(thisWeek) == 0) {
      thisWeek <- dummyRow
      thisWeek$household_key = house
      thisWeek$WEEK = weekN
    } else {
      thisWeek <- aggregate(cbind(QUANTITY,  BASE_SPEND_AMT, NET_SPEND_AMT, LOY_CARD_DISC, COUPON_DISC, GET_EGGS)
                            ~ household_key , data=thisWeek, sum, na.rm= TRUE)
    }
    if (nrow(nextWeek) == 0){
      nextEgg = 0
    } else {
      nextWeek <- aggregate(cbind(QUANTITY,  BASE_SPEND_AMT, NET_SPEND_AMT, LOY_CARD_DISC, COUPON_DISC, GET_EGGS)
                            ~ household_key , data=nextWeek, sum, na.rm= TRUE)
      nextEgg = sum(nextWeek$GET_EGGS)
    } 
    thisWeek$NEXT_EGGS <- nextEgg
    thisWeek$WEEK = weekN
    weekN = weekN - 1
    weekData <- rbind(weekData, thisWeek)
  }
}
 
# cleaning up
finalData <- weekData[weekData$WEEK > 0, ]
finalData$GET_EGGS[finalData$GET_EGGS > 0] <- 1
finalData$NEXT_EGGS[finalData$NEXT_EGGS > 0] <- 1
finalData <- merge(x = finalData, y = houseData, by = 'household_key', all = FALSE)
write.csv(finalData, '../data/weekData.csv')

# final week feature used for prediction
finalWeek <- finalData[finalData$WEEK == 28, ]
write.csv(finalWeek, "finalWeek.csv")
write.csv(finalWeek, "../data/finalWeek.csv")

 