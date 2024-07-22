from common.db import Database


class CreateHoodie:
    def __init__(self):
        self.db = Database()

    def execute(self, name: str, price: float, details: object):
        self.db.query(
            'INSERT INTO Hoodies(name, price, hoodieDetails)'
            'VALUES($1,$2,$3)'
            , [name, price, details])
        print("Inserting into db")
