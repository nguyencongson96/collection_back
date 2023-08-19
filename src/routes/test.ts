import express, { Router, Request, Response } from "express";
import connection from "../config/database";
import asyncWrapper from "../middleware/asyncWrapper";

const router: Router = express.Router();

const drinkList = [
  {
    name: "Frozen Piña Colada",
    image:
      "https://firebasestorage.googleapis.com/v0/b/collection-c2379.appspot.com/o/df4e6cf981c9d59033def2c8c527e687%2FFrozen_Pi%C3%B1a_Colada.jpg?alt=media&token=fb66757b-af8f-472c-8c15-2dcf9eb76d88",
    title: "",
    content: `The Frozen Piña Colada, a combination of rum, pineapple, lime, and coconut, is one of the most iconic drinks in the tropical cocktail canon. But despite its omnipresence in beach bars, pop culture, and 1970s songs about attempted infidelity, it can be hard to find one definitive recipe. As the national drink of Puerto Rico, the cocktail’s ties to the island are indisputable, but from there, the origins and recipe specifications get a bit murky.\nAt least two of the Piña Colada’s origin stories go to the Caribe Hilton Hotel in San Juan, where two bartenders, Ramón “Monchito” Marrero and Ricardo García, each laid claim to having first created the cocktail in the 1950s. Another San Juan bartender, Ramón Portas Mignot of Barrachina, asserted he created the cocktail in 1963, and a plaque outside the establishment still touts it as the birthplace of the Piña Colada. Conversely, other stories date the combination of ingredients to the 1800s. The debate as to the true origins of the drink rages on today, and likely won’t be resolved any time soon.\nWhat this trip through ambiguous cocktail history really means is that, despite being a classic cocktail with a 70+ year history, the Piña Colada doesn’t have a definitive “traditional” recipe. For years, particularly during the craft cocktail boom of the early 2000s, many bartenders took to skipping the blender and preparing their Piña Coladas shaken and served on the rocks or over pebble ice, mirroring industry-wide trends that aimed to “class up” drinks that got a bad rap in the 1980s and ’90s.\nHowever, the one thing the two dueling originators of the modern drink, Caribe Hilton and Barrachina, agree upon is that the Piña Colada should be blended and frozen.\nThe Frozen Piña Colada mostly adheres to the classic sour template of spirit, sugar, and citrus in the form of lime juice. However, unlike many other classic examples of sours that use liqueurs or simple syrup to provide sweetness, the Piña Colada relies on the natural sugars found in pineapple, as well as those in cream of coconut. The result is a tropical drink that doesn’t taste sticky-sweet or like artificial sugar, but rather showcases the flavors of tropical fruit.\nImportant to note is the need to use cream of coconut rather than coconut milk. Cream of coconut is a thicker and sweetened product that is needed to create the proper balance in a Frozen Piña Colada. Cream of coconut also has a higher fat content that creates a richer texture and mouthfeel, and provides structure to the cocktail to ensure it doesn’t dilute too quickly after blending.
    `,
  },
];

router.route("/").get(
  asyncWrapper(async (req: Request, res: Response) => {
    const { name, image, title, content } = drinkList[0];
    const result = await connection.query(
      `INSERT INTO drinks(name, image, title, content, createdAt, lastUpdatedAt) VALUES(?, ?, ?, ?, ?, ? )`,
      [name, image, title, content, new Date(), new Date()]
    );
    return res.json(result);
  })
);

export default router;
