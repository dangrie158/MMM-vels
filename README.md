# MMM-vels
A MagicMirror2 Module to display information about the usage of a boulder place.

This Module is heavily based on [MMM-vvsDeparture](https://github.com/niklaskappler/MMM-vvsDeparture).

## Installation
Run these commands at the root of your magic mirror install.

```shell
cd modules
git clone https://github.com/dangrie158/MMM-vels
```

## Using the module
To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-vels',
            position: "top_right",
            config: {
                host: '<YOUR_DATA_HOST_HERE>',
                // See below for more configurable options
            }
        }
    ]
}
```

Note that a `position` setting is not required.

## Configuration options
The following properties can be configured:

<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>host</code></td>
			<td></td>
		</tr>
		<tr>
			<td>
			    <code>reloadInterval</code>
			</td>
     		 <td>The refresh rate the usage will be updated in milliseconds. 
      			<br><br><b>Possible values:</b> <code>integer</code>
				<br><b>Default value:</b> <code>10 * 60 * 1000</code> e.q. one minute
			</td>
		</tr>
	</tbody>
</table>

