# /config

- `mappings/`: pre-wired mappings, covering multiple domains
  - `categories.js`: mappings of category => color and icon
  - `fields.js`: mapping of fields (ie properties/columns) to label & width
- `colors.js`: a color palette for the nodes of the graph
- `layout.js`: settings for the graph layout algorithm

*Note:* putting hardwired mapping in the Datanote client code is not
scalable: the client code should be generic, not tied to a specific
domain.

 The only reason mappings are still here is because Datanote
is still in development, some compromises have to be made,
and more work needs to be done to put these mappings into plugins.
