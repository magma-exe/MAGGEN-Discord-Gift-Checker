import random, string

amount = int(input('How Many codes you want to generate : '))
value = 1
while value <= amount:
	code = "" + ('').join(
	    random.choices(string.ascii_letters + string.digits, k=16))
	f = open('gift.txt', "a+")
	f.write(f'{code}\n')
	f.close()
	print(f'{code}')
	value += 1
