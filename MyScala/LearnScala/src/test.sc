import java.util

import scala.collection.mutable.ListBuffer

(1 until 5).foreach( _ => println("sdfsfds"))
val list = List(1,2,3,4)
def f(num:Int,arr:List[Int]):List[Int] = {
  var result = new ListBuffer[Int]()
  def print(X: Int): Unit = {
    (1 to num).foreach(result += X)
  }
  arr.foreach {print}
  result.toList
}
var resulut = f(2, List(1,2,3))