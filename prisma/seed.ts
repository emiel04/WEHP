import { Category, PrismaClient, Streepje } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

main()

async function main() {
  await prisma.user.create({
    data: {
      name: "WEHP",
      pincode: await hash("55555", 10),
      isWehp: true,
    }});
    await prisma.user.create({
      data: {
        name: "Emiel",
        pincode: await hash("55555", 10),
      }});
      await prisma.user.create({
        data: {
          name: "Jules",
          pincode: await hash("55555", 10),
        }});


    await prisma.category.createMany({
      data: [
        {name: "Racisme"},
        {name: "Cultuur"},
        {name: "Tante"},
        {name: "Mama"},
        {name: "Nicht"},
        {name: "Ander familielid"},
      ]
    })

}