import json
import codecs
import csv

if __name__ == '__main__':
  FILENAME_1 = "foodAndGroups/food_foundation.csv"
  FILENAME_2 = "foodAndGroups/food_legacy.csv"
  filesname = [FILENAME_1, FILENAME_2]
  ENCODING = 'utf-8'

  food_and_category = {}
  for filename in filesname:
    with codecs.open(filename, "r", ENCODING) as fp:
        reader = csv.reader(fp)

        headers = next(reader)

        for row in reader:
            description, category = row[2:4]
            simple_name = description.split(',')[0].upper().strip().split('-')[0]
            if (simple_name.endswith("S")):
                # items that are possibly plural we can duplicate without the 's'
                food_and_category[simple_name[:-1]] = category
            food_and_category[simple_name] = category

  with open("foodAndGroups/combinedGroups.json", "w") as outfile:
      json.dump(food_and_category, outfile)
    
  print("Don't forget to copy this to the meal_plan folder to update the production values")