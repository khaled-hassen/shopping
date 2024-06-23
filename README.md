# Shopping

**End of semester university project**

This application is a full-stack e-commerce web app. It allows users to sell and buy products. It's divided into 3 parts: Admin where the administrator can add categories, and subcategories, and configure the overall website. Backend, it's where all the business logic. And finally, the frontend where users can sell and buy products.

## Projects
* [Backend](https://github.com/khaled-hassen/shopping/tree/backend)

* [Admin](https://github.com/khaled-hassen/shopping/tree/admin)

* [Frontend](https://github.com/khaled-hassen/shopping/tree/frontend)

## Repository setup
```
git clone https://github.com/khaled-hassen/shopping.git
cd shopping
git worktree add Admin admin
git worktree add Backend backend
git worktree add Frontend frontend
```

## Backend setup
### ⚠️ Mongodb installation is required
> ⚠️ Project requirements:
> appsettings.json needs to be filled out

> ⚠️ Brevor API key is required

> ⚠️ Stripe API key and webhook secret are required
```
cd Backend/
dotnet restore
dotnet build
dotnet run
```

## Admin setup
### ⚠️ Backend server must be running to build the app or start the dev server
> ⚠️ .env file should be created and filled out

> ⚠️ Add this line to .npmrc file
`enable-pre-post-scripts=true`
```
cd Admin/
pnpm install
# build project
pnpm build
pnpm preview
# run the dev server
pnpm dev
```

## Frontend setup
### ⚠️ Backend server must be running to build the app or start the dev server
> ⚠️ .env file should be created and filled out

> ⚠️ TinyMCE cloud api key is required

> ⚠️ Add this line to .npmrc file
`enable-pre-post-scripts=true`
```
cd Frontend/
pnpm install
# build project
pnpm build
pnpm start
# run the dev server
pnpm dev
```
