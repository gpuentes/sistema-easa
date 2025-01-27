-- Atualiza preços nulos para 0
UPDATE produtos SET preco = 0 WHERE preco IS NULL;

-- Atualiza quantidades nulas para 0
UPDATE produtos SET quantidade = 0 WHERE quantidade IS NULL; 