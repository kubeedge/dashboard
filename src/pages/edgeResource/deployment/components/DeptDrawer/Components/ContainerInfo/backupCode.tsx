// import ContainerLifeCircle from "../ContainerLifeCircle";
// import ContainerHeathy from "../ContainerHeathy";
// <Form.Item
// className={styles.formItem}
// key={lifeCircleCheck}
// {...fieldContainer}
// label={
//   <>
//     <Checkbox
//       style={{ marginRight: 8 }}
//       value={lifeCircleCheck}
//       onChange={(e) => setLifeCircleCheck(e.target.checked)}
//     />
//     容器的生命周期回调
//   </>
// }
// name={[fieldContainer.name, "lifeCircle"]}
// fieldKey={[fieldContainer.fieldKey, "lifeCircle"]}
// >
// {lifeCircleCheck ? (
//   <>
//     <Form.Item label="PostStart">
//       <ContainerLifeCircle
//         showDetail={false}
//         name="PostStart"
//       />
//     </Form.Item>
//     <Form.Item label="PreStop">
//       <ContainerLifeCircle
//         showDetail={false}
//         name="PreStop"
//       />
//     </Form.Item>
//   </>
// ) : (
//   <div>设置容器的资源需求</div>
// )}
// </Form.Item>
// <Form.Item
// className={styles.formItem}
// {...fieldContainer}
// label={"容器的健康"}
// name={[fieldContainer.name, "lifeCircle"]}
// fieldKey={[fieldContainer.fieldKey, "lifeCircle"]}
// >
// <ContainerHeathy />
// </Form.Item>
