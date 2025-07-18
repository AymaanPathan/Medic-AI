var containsNearbyDuplicate = function (nums, k) {
  let map = {};
  for (let i = 0; i < nums.length; i++) {
    let num = nums[i];
    if (!map[num]) {
      map[num] = [i];
    } else {
      map[num].push(i);
    }
  }
  const aerr = Object.values(map);
  const res = aerr.find((data) => data.length > 1).sort((a, b) => b - a);
  const ans = res.reduce((acc, val) => acc - val);

  return ans <= k;
};

const nums = [1, 2, 3, 1, 2, 3];
const k = 2;
const answer = containsNearbyDuplicate(nums, k);
console.log(answer);
