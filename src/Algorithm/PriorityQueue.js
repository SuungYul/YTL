function PriorityQueue() {
  let items = [];

  function QueueElement(element, priority) {
    this.element = element;
    this.priority = priority;
  }

  this.enqueue = function (element, priority) {
    let queueElement = new QueueElement(element, priority);
    if (this.isEmpty()) {
      // 큐가 비어있다면 그냥 원소를 push
      items.push(queueElement);
    } else {
      // 큐가 비어있지 않다면 기존의 원소와 우선순위를 비교
      let added = false;
      for (let i = 0; i < items.length; i++) {
        if (queueElement.priority < items[i].priority) {
          // 새 원소보다 우선순위가 높은 원소가 있다면, 한 칸 앞에 새 원소를 추가
          items.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }
      // 기존 원소들보다 우선순위 낮으면 그냥 push
      if (!added) {
        items.push(queueElement);
      }
    }
  };

  // 큐에서 가장 처음에 추가된 원소를 삭제하고 반환
  this.dequeue = function () {
    return items.shift();
  };
  // 큐의 맨 앞의 원소를 확인
  this.front = function () {
    return items[0];
  };
  // 큐가 비어있는지 확인
  this.isEmpty = function () {
    return items.length == 0;
  };
  // 큐의 길이 확인
  this.size = function () {
    return items.length;
  };

  this.print = function () {
    let str = "";
    for (let i = 0; i < items.length; i++) {
      str += items[i].element + " ";
    }
    console.log(str);
  };
}

export default PriorityQueue;
