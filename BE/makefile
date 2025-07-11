.PHONY: install run test deploy

install:
	pip install --upgrade pip
	pip install -r requirements.txt

run:
	flask run

test:
	pytest -v tests/

deploy:
	# Add deployment steps here, e.g., using AWS CLI
	echo "Deploying the application..."