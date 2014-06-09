#!/usr/bin/env ruby

# Watch for file changes to source and build.
# Requires listen: `gem install -i . listen'

require 'listen'


# Run once
command = 'cd .. && bash build.sh'
system(command)

directories = ["../src"]
listener = Listen::Listener.new(*directories) do |modified, added, removed|
    modified.each do |f|
        # "[09/Mar/2013 19:38:47] "UPDATE /static/images/palmtree.png" :return_code :bytes"
        puts Time.now.strftime "[%d/%b/%Y %H:%M:%S] #{f}"
        system(command)
    end
end

# Includes
#listener.filter(/\.js$/)

# Excludes
listener.ignore(/\.swp$/)

listener.start
sleep
