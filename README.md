This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


1. To make protected route we have 2 options
a. Add a middleware
b. Add a layout page check for the session if no session then redirect user to home page.


2. Check out the role property
<div
  role="button"
>
  <ChevronsLeft className='h-6 w-6' />
</div>

3. Understand Navigation.tsx, Item.tsx, DocumentList.tsx component completely

4. line-clamp-1 and truncate tailwind class are same

5. To refetch data automatically when we update database we use
    onSuccess: () => {
      queryClient.invalidateQueries(["document"])
    }
    in useMutation hook so that as the databse changes useQuery refetch the new data


6. What is Record<string, boolean> type
const [expanded, setExpanded] = useState<Record<string, boolean>>({})

7. There was problem when passing params in axios get request so I have to make dynamic route in which I pass parentDocumentId and a simple route when no parentDocumentId is passed

8. learn How to make dynamic backend Route like:- /api/getDocument/[slug]/route.ts
  export async function GET(req: Request, { params }: { params: { slug: string }}) {
    const id = params.slug
  }

9. What is eslint

10. When you pass stringfy array in Response then in client side after query you don't need to parse the json. Found the problem in <TrashBox /> component when querung archiveDocument

eg:- 
  <!-- Server -->
  const data = ["a", "b", "c"]
  return new Response(JSON.stringfy(data))

  <!-- Client -->
  const { data } = await axios.get('')
  return data as document[]

  you do not have to parse the json string in client side it is already in original array format.

  some time you send object in json string but you don't have to parse it in client side.


11. In POST, PATCH, DELETE request you can pass payload in axios request.
    But to GET document by ID you have to pass params eg:- /api/document/${id}

12. Understand how search functionality works.
  How Search component works - we fetch all the documents and give it to <command> component and we type any word in <CommandInput> it internally filter out the items and display only that items which matches the word we searched

13. You can send optional data from client using axios payload using zod type created in validators folder. Then you can parse req body using zod validators.

14. useMutation can currently only take one argument for variables. 

    <!-- 🚨 this is invalid syntax and will NOT work -->
    const mutation = useMutation({
      mutationFn: (title, body) => updateTodo(title, body),
    })

    <!-- ✅ use an object for multiple variables -->
    const mutation = useMutation({
      mutationFn: ({ title, body }) => updateTodo(title, body),
    })


15. If you don't want that you data gets cache then you can simply put cacheTime: 0  in useQuery
    eg:- const { data } = useQuery({
      queryKey: [],
      queryFn: () => {},
      cacheTime: 0
    })

    every time when component renders then useQuery will fetch new data.
    used in file Navbar.tsx


TODO:-
1. add userAccountNav components

2. Also Add SignOut Option

3. To be able to use useSession first you'll need to expose the session context, <SessionProvider />, at the top level of your application
<SessionProvider session={session}>
  <Component {...pageProps} />
</SessionProvider>

4. Add Loading states

5. Use zustand for global state management for getAuthUser(), useQuery

6. Fix the recursion in file management.

7. Fix the drop down menu opactity or z index

8. Why it is showing module not found error when importing document.d.ts file in SearchCommand.tsx file.

9. Create Zod validators for req body for all routes