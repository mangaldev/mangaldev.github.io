object  HelloWorld extends App{

  println("Hello")

  var numbers = List(1,2,3,4,5,6,7,89,100)

  numbers.foreach(t => println(t))

  val ls = List("Mary", "had", "a", "little", "lamb")
  ls.foreach( e => println(e.toUpperCase) )

//  numbers.foreach(println ((_:Int)+1).toString())
  def increaser(more: Int) = (x:Int) => x + more


  val increBy1 = increaser(1)

  println(increBy1(10))

  (1 to 5).foreach(println _)
}

