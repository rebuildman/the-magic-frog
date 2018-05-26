<template>
    <tr>
    <td>{{transfer[1].op[1].from}}</td>
    <td>{{transfer[1].op[1].to}}</td>
    <td>{{transfer[1].op[1].amount}}</td>
    <td>{{transfer[1].op[1].memo}}</td>

    </tr>
</template>
<script>
export default {
    props:['transfer','index']
}
</script>

