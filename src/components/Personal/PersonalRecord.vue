<!--
 * @Date: 2020-10-08 15:31:00
 * @LastEditors: 小枫
 * @LastEditTime: 2020-11-18 14:00:04
 * @FilePath: \book\src\components\Personal\PersonalRecord.vue
-->
<template lang="pug">
.record
  .chart(ref="chartRef")
</template>

<script>
// 引入echarts
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/radar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
export default {
  data() {
    return {
      userReadInfo: [],
      typeList: [{ typeId: 0, typeName: "其他" }],
      sort: [],
    };
  },
  async mounted() {
    await this.getUserReadInfo()
    let myChart = echarts.init(this.$refs.chartRef);
    myChart.setOption({
      title: {
        text: "阅读爱好分析",
      },
      legend: {
        data: ["阅读类型"],
      },
      radar: [
        {
          indicator: [
            ...this.sort.map((item) => {
              return {name: this.typeList[item.key].typeName, max: Math.ceil(this.sort[0].value / 10) * 10}
            })
          ],
          // center: ["25%", "50%"],
          radius: 120,
          startAngle: 90,
          splitNumber: 4,
          shape: "circle",
          name: {
            formatter: "【{value}】",
            textStyle: {
              color: "#72ACD1",
            },
          },
          splitArea: {
            areaStyle: {
              color: [
                "rgba(114, 172, 209, 0.2)",
                "rgba(114, 172, 209, 0.4)",
                "rgba(114, 172, 209, 0.6)",
                "rgba(114, 172, 209, 0.8)",
                "rgba(114, 172, 209, 1)",
              ],
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          // axisLabel: {
          //   show: true,
          //   fontSize: 12,
          //   color: '#838D9E',
          //   showMaxLabel: false, //不显示最大值，即外圈不显示数字30
          //   showMinLabel: true, //显示最小数字，即中心点显示0
          // },
        },
      ],
      series: [
        {
          name: "雷达图",
          type: "radar",
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },
          data: [
            {
              value: [...this.sort.map((item) => {
                return item.value
              })],
              name: "阅读类型",
              symbol: "rect",
              symbolSize: 5,
              lineStyle: {
                type: "dashed",
              },
              // areaStyle: { // 填充颜色
              //     opacity: 0.9,
              //     color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              //       {
              //         color: '#B8D3E4',
              //         offset: 0
              //       },
              //       {
              //         color: '#72ACD1',
              //         offset: 1
              //       }
              //     ])
              //   },
              // label: { // 显示数值
              //   normal: {
              //       show: true,
              //       color: '#677183',
              //       formatter: (params) => {
              //           return params.value
              //       },
              //   },
              // },
            },
          ],
        },
      ],
    });
  },
  // computed: {
  //   sort() {
  //     const readMap = this.userReadInfo.map((item, index) => {
  //       return {key: index + 1, value: item}
  //     })
  //     const sortMap = readMap.sort((a, b) => {
  //       return b.value - a.value
  //     })
  //     let other
  //     if(sortMap.slice(5).length !== 0) {
  //       other = sortMap.slice(5).map((item) => {
  //         return item.value
  //       }).reduce((item1, item2) => {
  //         return item1 + item2
  //       })
  //     } else {
  //       other = 0
  //     }
  //     const five = sortMap.slice(0, 5)
  //     return [...five, {key: 0, value: other}]
  //   }
  // },
  methods: {
    getUserReadInfo() {
      // 获取阅读数据
      return this.$http
        .get("/data/user/data")
        .then((res) => {
          if (res) {
            // console.log(res);
            this.userReadInfo = res.data.obj
            const readMap = this.userReadInfo.map((item, index) => {
              return { key: index + 1, value: item };
            });
            const sortMap = readMap.sort((a, b) => {
              return b.value - a.value;
            });
            let other;
            if (sortMap.slice(5).length !== 0) {
              other = sortMap
                .slice(5)
                .map((item) => {
                  return item.value;
                })
                .reduce((item1, item2) => {
                  return item1 + item2;
                });
            } else {
              other = 0;
            }
            const five = sortMap.slice(0, 5);
            this.sort = [...five, { key: 0, value: other }];
          }
        })
    },
    getTypeList() {
      // 获取分类
      this.$http.get("/booktype/querytype").then((res) => {
        if (res) {
          // console.log(res);
          this.typeList.push(...res.data.obj);
        }
      });
    },
  },
  created() {
    
    this.getTypeList()
  },
};
</script>

<style lang="less" scoped>
.record {
  width: 100%;
  .chart {
    height: 400px;
  }
}
</style>