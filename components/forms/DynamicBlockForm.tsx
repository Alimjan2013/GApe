'use client'

import { useForm, DefaultValues, Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Block } from "@/types"
import { blockFormConfigs, FieldConfig } from "./formSchemas"
import { ProfileCardProps, ProjectCardProps, EducationCardProps, PublicationCardProps, ExperienceCardProps } from "@/types"
import { ImageUpload } from "./ImageUpload"

type BlockData = ProfileCardProps | ProjectCardProps | EducationCardProps | PublicationCardProps | ExperienceCardProps

interface DynamicBlockFormProps<T extends BlockData> {
    block: Block
    onSave: (block: Block) => void
}

export function DynamicBlockForm<T extends BlockData>({ block, onSave }: DynamicBlockFormProps<T>) {

    // Generate Zod schema dynamically based on block type
    const generateZodSchema = (config: Record<string, FieldConfig>) => {
        const schema: Record<string, any> = {}
        
        Object.entries(config).forEach(([fieldName, fieldConfig]) => {
            let fieldSchema = z.string()
            
            if (fieldConfig.validation) {
                if (fieldConfig.validation.required) {
                    fieldSchema = fieldSchema.min(1, "This field is required")
                }
                if (fieldConfig.validation.min) {
                    fieldSchema = fieldSchema.min(fieldConfig.validation.min)
                }
                if (fieldConfig.validation.max) {
                    fieldSchema = fieldSchema.max(fieldConfig.validation.max)
                }
                if (fieldConfig.validation.email) {
                    fieldSchema = fieldSchema.email("Invalid email address")
                }
                if (fieldConfig.validation.url) {
                    fieldSchema = fieldSchema.url("Invalid URL")
                }
            }
            
            schema[fieldName] = fieldSchema
        })
        
        return z.object(schema)
    }

    const formConfig = blockFormConfigs[block.type] || {}
    const form = useForm<T>({
        resolver: zodResolver(generateZodSchema(formConfig)),
        defaultValues: block.data as DefaultValues<T>,
    })

    const onSubmit = (data: any) => {
        onSave({
            ...block,
            data: data,
        })
    }

    
    const renderField = (fieldName: string, config: FieldConfig) => {
        return (
            <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as Path<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{config.label}</FormLabel>
                        <FormControl>
                            {config.type === 'upload' ? (
                                <ImageUpload
                                    value={field.value as string}
                                    onChange={field.onChange}
                                    onRemove={() => {
                                        field.onChange("");
                                        form.trigger(fieldName as Path<T>);
                                    }}
                                />
                            ) : config.type === 'textarea' ? (
                                <Textarea {...field} placeholder={config.placeholder} />
                            ) : (
                                <Input 
                                    {...field} 
                                    type={config.type}
                                    placeholder={config.placeholder}
                                />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {Object.entries(formConfig).map(([fieldName, config]) => 
                    renderField(fieldName, config)
                )}
                <Button type="submit" className="w-full">Save Changes</Button>
            </form>
        </Form>
    )
} 