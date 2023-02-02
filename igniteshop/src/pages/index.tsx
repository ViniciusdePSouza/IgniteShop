import { HomeContainer, ProductShop } from '../styles/pages/home'
import Image from 'next/image'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import { stripe } from '../lib/stripe'

import { GetStaticProps } from 'next'

import Stripe from 'stripe'

interface HomeProps {
    products: {
        id: string
        name: string
        imgURL: string
        price: number
    }[]
}

export default function Home({ products }: HomeProps) {
    const [sliderRef] = useKeenSlider({
        slides: {
            perView: 3,
            spacing: 48
        }
    })
    return (
        <HomeContainer ref={sliderRef} className='keen-slider'>
            {
                products.map(product => {
                    return (
                        <ProductShop className='keen-slider__slide' key={product.id}>
                            <Image src={product.imgURL} width={520} height={480} alt='' />
                            <footer>
                                <strong>{product.name}</strong>
                                <span>{product.price}</span>
                            </footer>
                        </ProductShop>
                    )
                })
            }
        </HomeContainer>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const response = await stripe.products.list({
        expand: ['data.default_price']
    })

    const products = response.data.map(product => {
        const price = product.default_price as Stripe.Price
        return {
            id: product.id,
            name: product.name,
            imgURL: product.images[0],
            price: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format( 0.01 * price.unit_amount!)
        }
    })

    return {
        props: {
            products
        }
    }
}