FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

# restore and publish app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-dotnet
WORKDIR /src
COPY ./KaraokeParty .
RUN dotnet publish -c Release -o /app

# build and publish the React SPA
FROM node:19.3 AS build-react
WORKDIR /src
COPY ./KPFrontend .
RUN npm run build

# deploy built application to new container
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-dotnet /app /app
COPY --from=build-react /src/build /app/FrontEndSpa
ENTRYPOINT ["dotnet","KaraokeParty.dll"]