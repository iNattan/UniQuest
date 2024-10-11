FROM nixos/nix

COPY ./.nixpacks /app/.nixpacks
WORKDIR /app

RUN nix-env -if .nixpacks/nixpkgs-e05605ec414618eab4a7a6aea8b38f6fbbcc8f08.nix && nix-collect-garbage -d

COPY . /app
RUN npm install

CMD ["npm", "start"]
