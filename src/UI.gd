extends CanvasLayer
#
#var health_states = [
	#"[▯▯▯▯▯▯▯▯▯▯]",
	#"[▮▯▯▯▯▯▯▯▯▯]",
	#"[▮▮▯▯▯▯▯▯▯▯]",
	#"[▮▮▮▯▯▯▯▯▯▯]",
	#"[▮▮▮▮▯▯▯▯▯▯]",
	#"[▮▮▮▮▮▯▯▯▯▯]",
	#"[▮▮▮▮▮▮▯▯▯▯]",
	#"[▮▮▮▮▮▮▮▯▯▯]",
	#"[▮▮▮▮▮▮▮▮▯▯]",
	#"[▮▮▮▮▮▮▮▮▮▯]",
	#"[▮▮▮▮▮▮▮▮▮▮]"
#]
#
#
#@onready var health = get_node("Main/Health")
## Called when the node enters the scene tree for the first time.
#func _ready():
	#pass
#
#
## Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#
	#health.text = "Health: " + health_states[Player.health]
	##%Health.text = health_states[health] 
	##var offset = Player.velocity * delta
	##health.position += offset
