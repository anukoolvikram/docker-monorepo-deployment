import { prismaClient } from "db/client";

export default async function Home() {
  const users=await prismaClient.user.findMany();
  const todos=await prismaClient.todo.findMany();
  return (
   <div>
    <div>{JSON.stringify(users)}</div>
    <div>{JSON.stringify(todos)}</div>
   </div>
  );
}
