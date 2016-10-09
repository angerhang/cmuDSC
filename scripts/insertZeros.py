

#Dictionary for households and their metadata
#Check if household has purchased eggs

#Columns 4 = Day, 5 = Product, 6-10 = Set to Zero, 11-17 = Set to NA or the values for household if they exist
#Columns 18, 19, 20 = Grocery, Eggs, EGGS - LARGE
#Columns 21 = Price/Product -> Set to 0
ROW_DATA_DIR = "../data/cleanData.csv"
OUTPUT_DIR = "../data/cleanRowData.csv"

MAX_DAY = 204
NUM_MAX_HOUSEHOLDS = 1000
if __name__=="__main__":
    with open(ROW_DATA_DIR, 'r') as rin:
        with open(OUTPUT_DIR, 'w') as rout:
            lines = rin.readlines()
            header = lines[0].split(',')
            household_metadata = {}

            #fill out the dictionary
            for line in lines[1:]:
                #split the data into individual entries
                data_split = line.split(',')
                household_key = data_split[2]
                metadata = []
                for index in range(3, len(header)):
                    metadata.append(data_split[index])
                if int(household_key) not in household_metadata.keys():
                    print("household_key: " + str(household_key))
                    household_metadata[int(household_key)] = []
                household_metadata[int(household_key)].append(metadata)

            #check if household has purchased egg on current day
            purchased_eggs = [[False for i in range(0, NUM_MAX_HOUSEHOLDS+1)] for j in range(0,MAX_DAY+1) ]
            for hId in household_metadata.keys():
                for metadata in household_metadata[hId]:
                #metadata is a list for one row
                #index for SUB_COMMODITY_DESC in metadata = 17
                    day =  int(metadata[1])
                    if "EGGS" in metadata[17]:
                        purchased_eggs[day][hId] = True

            #create new rows if household did not purchase eggs in a given day
            basket_counter = 0
            row_count = 287507
            for d in range(0, MAX_DAY+1):
                for hId in range(1, NUM_MAX_HOUSEHOLDS+1):
                    if not purchased_eggs[d][hId]:
                    #create a new row based on household info
                        data_split = []
                        #basket id
                        data_split.insert(0, basket_counter)
                        basket_counter = basket_counter + 1
                        #day
                        data_split.insert(1, d)
                        #ProductID
                        data_split.insert(2, 840361)
                        #3-7
                        for i in range(3, 8):
                            data_split.insert(i, 0)
                        #18, 19, 20
                        data_split.insert(15, "\"GROCERY\"")
                        data_split.insert(16, "\"EGGS\"")
                        data_split.insert(17, "\"EGGS - LARGE\"")
                        #Price/Product
                        data_split.insert(18, 0)
                        #Household Info
                        for i in range(8, 15):
                            if hId in household_metadata.keys():
                                data_split.insert(i, household_metadata[hId][0][i])
                            else:
                                data_split.insert(i, "NA")
                        data_split.insert(0, "\"" + str(row_count) + "\"")
                        data_split.insert(1, str(row_count))
                        data_split.insert(2, hId)
                        data_split = [str(x) for x in data_split]
                        toprint = ",".join(data_split)
                        lines.append(toprint)
                        row_count = row_count + 1
            for line in lines:
                rout.write(line + '\n')



