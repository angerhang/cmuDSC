library(plyr)
commCount <- count(myData, 'COMMODITY_DESC')
ratio <- commCount
ratio$freq <- (ratio$freq  - min(ratio$freq))/ (max(ratio$freq) - min(ratio$freq))
orderedR <- ratio[with(ratio, order(-ratio$freq)), ]

# aggregate the most common stuff to purchase eggs with

# use that to fileter out the comm descs 
# for not not considering comm descs 

# number of days since last pruchase 


uData <- myData[!duplicated(data.frame(myData$household_key, myData$DAY)),]